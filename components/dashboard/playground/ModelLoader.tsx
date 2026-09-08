import { Html, useProgress } from '@react-three/drei';

export const ModelLoader = () => {
    const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-sm font-medium text-gray-500 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
        Loading model: {progress.toFixed(0)}%
      </div>
    </Html>
  )
}