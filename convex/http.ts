// convex/http.ts

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";



const http = httpRouter()


// make a safe datatype enum maybe for all API paths
export enum ApiPath {
    webhook = "/api/webhook",
}

// Webhook endpoint for when the BrightData Perplexity scrapper completes
http.route({
    path: ApiPath.webhook,
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        type Job = {
            _id: Id<"scrapingJobs">;
            originalPrompt: string;
            status: string;
        }

        let job: Job | null = null

        try {
            const data = await req.json()
            console.log("Received webhook data:", data)

            // Extract job Id from the webhook URL query parameters
            const url = new URL(req.url);
            const jobId = url.searchParams.get("jobId");

            if (!jobId) {
                console.log("No jobId found in webhook data:", data);
                return new Response("No jobId found", { status: 400 });
            };

            // find the job by Id
            job = await ctx.runQuery(api.scrapingJobs.getJobById, { jobId: jobId as Id<"scrapingJobs"> });

            if (!job) {
                console.error(`No job found for job ID: ${jobId}`);
                return new Response(`No job found for job ID: ${jobId}`, {
                    status: 401
                })
            }

            // Step 1 : Save raw scrapping data first from bright data
            const rawResults = Array.isArray(data) ? data : [data];
            await ctx.runMutation(internal.scrapingJobs.saveRawScrapingData, {
                jobId: job._id,
                rawData: rawResults
            })

            console.log()
            // step 2 schedule AI analysis as background job 
            await ctx.scheduler.runAfter(0, internal.analysis.runAnalysis, {
                jobId: job._id,
            })

            console.log(
                `Analysis schedule for job ${job._id}, webhook returning immediately `
            )
            return new Response('Success', { status: 200 });

        } catch (error) {
            console.error("Webhook error:", error)

            // Set job status to failed when analysis fails (only if job was found)
            if (job) {
                try {
                    await ctx.runMutation(api.scrapingJobs.failJob, {
                        jobId: job._id,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Unknown error occurred during analysis",
                    });
                    console.log(`Job ${job._id} marked as failed due to analysis error`);
                } catch (failError) {
                    console.error("Failed to update job status to failed:", failError);
                }
            }

            // If it's a schema validation error, provide more specific feedback
            if (error instanceof Error && error.message.includes("schema")) {
                console.error("Schema validation failed - AI response incomplete");
                console.error("Error details:", error.message);
            }

            return new Response("Internal Server Error", { status: 500 });
        
    }

    })
})



export default http