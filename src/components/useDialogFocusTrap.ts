import { useEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react'

type DialogFocusTrapOptions = {
  open: boolean
  onEscape?: () => void
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true',
  )

export function useDialogFocusTrap<TElement extends HTMLElement>({
  open,
  onEscape,
}: DialogFocusTrapOptions): {
  dialogRef: RefObject<TElement | null>
  onKeyDown: (event: ReactKeyboardEvent<TElement>) => void
} {
  const dialogRef = useRef<TElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!open || !dialog) {
      return
    }

    const ownerDocument = dialog.ownerDocument
    previousFocusRef.current =
      ownerDocument.activeElement instanceof HTMLElement ? ownerDocument.activeElement : null

    const focusDialog = () => {
      const [firstFocusableElement] = getFocusableElements(dialog)
      ;(firstFocusableElement ?? dialog).focus()
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && dialog.contains(event.target)) {
        return
      }

      focusDialog()
    }

    focusDialog()
    ownerDocument.addEventListener('focusin', handleFocusIn)

    return () => {
      ownerDocument.removeEventListener('focusin', handleFocusIn)

      if (previousFocusRef.current && ownerDocument.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus()
      }

      previousFocusRef.current = null
    }
  }, [open])

  const onKeyDown = (event: ReactKeyboardEvent<TElement>) => {
    if (!open) {
      return
    }

    if (event.key === 'Escape' && onEscape) {
      event.preventDefault()
      event.stopPropagation()
      onEscape()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    const focusableElements = getFocusableElements(dialog)

    if (focusableElements.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements.at(-1)

    if (!lastFocusableElement) {
      return
    }

    if (event.shiftKey && event.currentTarget.ownerDocument.activeElement === firstFocusableElement) {
      event.preventDefault()
      lastFocusableElement.focus()
      return
    }

    if (!event.shiftKey && event.currentTarget.ownerDocument.activeElement === lastFocusableElement) {
      event.preventDefault()
      firstFocusableElement.focus()
    }
  }

  return { dialogRef, onKeyDown }
}
