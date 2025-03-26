import React from 'react'

const PurposeSection = () => {
  const heading = "📸 Turning memories into art.".split(" ")
  const paragraph =
    "From landscapes and portraits to product photography and candid shots — I capture the essence of each moment with clarity, emotion, and a creative touch. Let the visuals speak louder than words.".split(" ")

  return (
    <section className='w-full bg-gray-50 py-16 px-4 md:px-8 sm:px-6'>
      <div className="container mx-auto text-center space-y-6 max-w-3xl">
        
        {/* Heading with hover effect */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {heading.map((word, index) => (
            <span
              key={index}
              className="transition-colors duration-300 hover:text-red-800 cursor-default"
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Paragraph with hover effect */}
        <p className="text-lg md:text-xl text-gray-600 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {paragraph.map((word, index) => (
            <span
              key={index}
              className="transition-colors duration-300 hover:text-red-700 cursor-default"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

export default PurposeSection
