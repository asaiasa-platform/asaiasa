import Badge from "@/components/common/Badge";
import NotFoundSVG from "@/components/page/NotFound";
import { getJobDescription } from "@/features/jobs/api/action";
import JobRegBtn from "@/features/jobs/components/JobRegBtn";
import { JobDescriptionPage } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default async function JobPage({
  params,
}: Readonly<{ params: { jobId: string; locale: string } }>) {
  const job: JobDescriptionPage = await getJobDescription(params.jobId);

  if (!job) {
    return <NotFoundSVG />;
  }

  return (
    <main className="container mx-auto sm:py-8 mt-[65px]">
      <div className="bg-white rounded-lg sm:shadow-md max-w-4xl mx-auto sm:drop-shadow-md">
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
          <div className="mb-6 text-sm text-gray-500">
            <Link
              href={`/orgs/${job.organization.id}/org-detail`}
              className="underline hover:text-gray-700"
            >
              {job.organization.name}
            </Link>
            <span className="text-lg mx-2">•</span>
            <span className="text-xs font-light">
              Last updated: {formatRelativeTime(job.updatedAt, params.locale)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.workType} - {job.careerStage}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">{job.workplace}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Clock className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.hoursPerDay} hours/day
              </span>
            </div> */}
            <div className="flex items-center gap-2">
              <Calendar className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">{job.period}</span>
            </div>
            {job.salary > 0 && job.workType !== "volunteer" && (
              <div className="flex items-center gap-2">
                <DollarSign className="text-primary shrink-0" />
                <span className="text-sm text-gray-700">
                  ฿{job.salary.toLocaleString()}/month
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="text-primary shrink-0" />
              <span className="text-sm text-gray-700">
                {job.quantity} position{job.quantity > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {job.categories.map((sector) => (
              <Badge
                key={sector.value}
                label={sector.label}
                className="text-sm"
              />
            ))}
          </div>

          <div>
            <JobRegBtn url={job.registerLink} />
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Job Description</h2>
              <pre className="font-prompt text-base font-normal whitespace-pre-wrap break-words text-gray-700">
                {job.description}
              </pre>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Job Scope</h2>
              <pre className="font-prompt text-base font-normal whitespace-pre-wrap break-words text-gray-700">
                {job.scope}
              </pre>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Qualifications</h2>
              <pre className="font-prompt text-base font-normal whitespace-pre-wrap break-words text-gray-700">
                {job.qualifications}
              </pre>
            </section>

            {/* <section>
            <h2 className="text-xl font-semibold mb-2">Benefits</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
          </section> */}

            {job.prerequisite && job.prerequisite.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  <span>Prerequisite Courses</span>
                  <span className="text-sm font-light text-gray-500">
                    {" (Recommended)"}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.prerequisite.map((course) => (
                    <Link
                      href={course.link}
                      key={course.value}
                      className="bg-white"
                    >
                      <div className="h-full flex flex-col justify-between border rounded-lg p-4 hover:shadow-md">
                        <div className="flex items-start gap-2 mb-2">
                          <BookOpen className="text-primary shrink-0" />
                          <h3 className="font-medium line-clamp-1">
                            {course.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 text-right">
                          Click to learn more
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
