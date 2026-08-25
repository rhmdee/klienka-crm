import Link from "next/link";

export default function Page() {
  return (
    <div>
      ini page pipeline. go to{" "}
      <Link href="/pipeline/detail" className="text-blue-600">
        detail
      </Link>
    </div>
  );
}
