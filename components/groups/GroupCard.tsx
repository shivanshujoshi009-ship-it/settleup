import Link from "next/link";

type Props = {
  id: string;
  name: string;
};

export default function GroupCard({ id, name }: Props) {
  return (
    <Link href={`/groups/${id}`}>
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold text-white">
          {name}
        </h2>

        <p className="mt-2 text-slate-400">
          No expenses yet
        </p>
      </div>
    </Link>
  );
}