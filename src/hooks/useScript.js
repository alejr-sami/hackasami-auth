import { useEffect } from 'react'

const useScript = (url, options) => {
  const loadScript = () => {
    const { onLoad, onError } = options || {}
    const hasScript = !!document.querySelector(`script[src="${url}"]`)
    if (!hasScript) {
      const scriptTag = document.createElement('script')
      scriptTag.async = true
      scriptTag.defer = true
      scriptTag.src = url
      scriptTag.onload = onLoad
      scriptTag.onerror = onError
      document.body.appendChild(scriptTag)
    } else if (typeof onLoad === 'function') {
      onLoad()
    }
  }

  useEffect(loadScript, [])
}

export default useScript
