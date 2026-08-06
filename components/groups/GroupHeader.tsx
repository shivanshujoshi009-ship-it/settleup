type Props = {
  name: string;
};

export default function GroupHeader({ name }: Props) {
  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-white">
          {name}
        </h1>

        <p className="mt-2 text-slate-400">
          Manage expenses and members
        </p>
      </div>
    </div>
  );
}