import { useEffect, useState } from 'react'
import { ADS_ENABLED } from '../consts'

const googleAdsURL =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

/**
 * Detects whether adblock is blocked by sending a fake fetch request to googlead.js,
 * and checking for content within #adsbygoogle class
 */
export function useIsAdblocked() {
  const [adBlockEnabled, setAdBlockEnabled] = useState(false)

  useEffect(() => {
    if (!ADS_ENABLED) return
    const fetchUrl = async () => {
      try {
        await fetch(new Request(googleAdsURL)).catch((_) => {
          setAdBlockEnabled(true)
        })
      } catch (_err) {
        setAdBlockEnabled(true)
      }
    }
    fetchUrl()
    const timeout = setTimeout(() => {
      const eles = document.getElementsByClassName('adsbygoogle')
      const allEmpty = Array.from(eles).every((e) => e.innerHTML.trim() === '')
      if (allEmpty) setAdBlockEnabled(true)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [])

  return adBlockEnabled
}
