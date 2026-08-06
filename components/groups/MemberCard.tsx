type Props = {
  name: string;
};

export default function MemberCard({ name }: Props) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
      <p className="font-medium text-white">
        {name}
      </p>
    </div>
  );
}