import { onBeforeUnmount, ref } from 'vue'

/**
 * Track an element's rendered width via ResizeObserver. Returns a function ref
 * (`setEl`) to bind with `:ref`, plus a reactive `width`. Used to size a donut's
 * center text from its actual pixel size (not the viewport), so the text always
 * fits the ring regardless of how the tile has reflowed.
 */
export function useElementSize() {
  const width = ref(0)
  let ro: ResizeObserver | undefined

  const setEl = (elOrComponent: unknown) => {
    ro?.disconnect()
    ro = undefined
    const node =
      elOrComponent && typeof elOrComponent === 'object' && '$el' in elOrComponent
        ? ((elOrComponent as { $el: unknown }).$el as HTMLElement | null)
        : (elOrComponent as HTMLElement | null)
    if (!node || typeof ResizeObserver === 'undefined') return
    ro = new ResizeObserver((entries) => {
      width.value = entries[0].contentRect.width
    })
    ro.observe(node)
    width.value = node.clientWidth
  }

  onBeforeUnmount(() => ro?.disconnect())

  return { setEl, width }
}
