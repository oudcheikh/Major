import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './pendingCoursSlice'
import styles from './pendingCours.module.css'

export function pendingCours() {
  const count = useSelector((state) => state.pendingCours.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}