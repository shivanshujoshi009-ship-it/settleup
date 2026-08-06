type Props = {
  members: string[];
};

export default function MembersList({ members }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Members ({members.length})
      </h2>

      {members.length === 0 ? (
        <p className="text-slate-400">
          No members
        </p>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
            >
              {member}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}