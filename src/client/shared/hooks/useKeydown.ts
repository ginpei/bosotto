import { useEffect, RefObject } from 'react';

type ElementType = HTMLElement | Document | null;

/**
 * A custom hook for handling keydown events on a specified element
 * @param handler The event handler function for keydown events
 * @param element The element to attach the event listener to (defaults to document)
 */
function useKeydown(
  handler: (e: KeyboardEvent) => void,
  element: ElementType | RefObject<HTMLElement> = document
): void {
  useEffect(() => {
    // Get the target element from RefObject if applicable
    const targetElement: ElementType = 
      element && 'current' in element ? element.current : element;
    
    if (!targetElement) return;
    
    const eventHandler = ((e: Event) => handler(e as KeyboardEvent)) as EventListener;
    
    targetElement.addEventListener('keydown', eventHandler);
    return () => {
      targetElement.removeEventListener('keydown', eventHandler);
    };
  }, [handler, element]);
}

export default useKeydown;
