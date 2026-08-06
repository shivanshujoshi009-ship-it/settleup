"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
};

export default function AddExpenseButton({
  onClick,
}: Props) {
  return (
    <Button onClick={onClick}>
      + Add Expense
    </Button>
  );
}