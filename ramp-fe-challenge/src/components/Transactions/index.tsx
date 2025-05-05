import { useCallback, useEffect, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import {
  SetTransactionApprovalFunction,
  TransactionsComponent,
} from "./types"

export const Transactions: TransactionsComponent = ({
  transactions,
  onTransactionChange,
}) => {
  const { fetchWithoutCache, loading } = useCustomFetch()

  const [localTransactions, setLocalTransactions] = useState(transactions)

  useEffect(() => {
    setLocalTransactions(transactions)
  }, [transactions])

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>(
        "setTransactionApproval",
        { transactionId, value: newValue }
      )

      setLocalTransactions((prev) =>
        prev
          ? prev.map((t) =>
            t.id === transactionId ? { ...t, approved: newValue } : t
          )
          : null
      )

      onTransactionChange?.({ transactionId, newValue })
    },
    [fetchWithoutCache, onTransactionChange]
  )

  if (localTransactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {localTransactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
