import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const ExpenseForm = () => {
  const { addExpense } = useFinance();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return;

    addExpense({
      id: Date.now(),
      title,
      amount: Number(amount),
    });

    setTitle("");
    setAmount("");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Expense name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default ExpenseForm;