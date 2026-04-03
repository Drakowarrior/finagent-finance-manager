import React from "react";
import { useFinance } from "../context/FinanceContext";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = () => {
  const { expenses } = useFinance();

  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p>No expenses added</p>
      ) : (
        expenses.map((exp) => <ExpenseItem key={exp.id} expense={exp} />)
      )}
    </div>
  );
};

export default ExpenseList;