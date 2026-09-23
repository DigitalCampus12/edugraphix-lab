import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // Use the initial value of the media query
    const initialValue = mql.matches
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(initialValue)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
