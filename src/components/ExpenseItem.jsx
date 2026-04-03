import React from "react";
import { useFinance } from "../context/FinanceContext";

const ExpenseItem = ({ expense }) => {
  const { deleteExpense } = useFinance();

  return (
    <div className="expense-item">
      <div>
        <h4>{expense.title}</h4>
        <p>₹{expense.amount}</p>
      </div>
      <button onClick={() => deleteExpense(expense.id)}>Delete</button>
    </div>
  );
};

export default ExpenseItem;