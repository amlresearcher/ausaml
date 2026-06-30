import { useEffect, useState } from 'react'
import { About } from '../components/sections/About'
import { DatasetStats } from '../components/sections/DatasetStats'
import { TypologyOverview } from '../components/sections/TypologyOverview'
import { Validation } from '../components/sections/Validation'
import { fetchTypologies } from '../data/loaders'
import type { TypologyMeta } from '../data/types'

export function Home() {
  const [typologies, setTypologies] = useState<TypologyMeta[]>([])

  useEffect(() => {
    fetchTypologies().then(setTypologies).catch(console.error)
  }, [])

  return (
    <main>
      <About />
      <DatasetStats />
      {typologies.length > 0 && <TypologyOverview typologies={typologies} />}
      <Validation />
    </main>
  )
}
