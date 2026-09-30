export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#000000] text-[var(--page-text)] p-4 md:p-6">
      <div className="max-w-6xl mx-auto h-full flex gap-6 flex-col md:flex-row md:items-center">
        {/* Left: project description */}
        <div className="flex-1 border border-[var(--border)] rounded p-4 md:p-5 bg-[#040b14] shadow-lg shadow-black/30">
          <div className="space-y-2 text-sm md:text-[15px] leading-relaxed text-[var(--muted-text)]">
            <p>
              This project is for Assessment 1, developing a web application using React and Next.js.
              The focus is on Frontend design and usability.
            </p>
            <p>
              VS Code with Next.js and React form the basis of the application.
            </p>
            <p>
              The use of AI coding tools was the Claude 4.6 model with GitHub Co-Pilot. All code is uploaded onto my GitHub student account.
            </p>
            <p>
              Research was done as per the links on the Home Page to understand what the Phonemes are about. Based on the research learning Phonemes are primarily for literacy education.
            </p>
            <p>
              When the player successfully completes the Wordle or WordSearch game, a simple message with a trophy is displayed. This encourages a positive learning environment.
            </p>
            <p>
              I have made the Word search to only arrange letters in Left to Right, Left to Right Diagonal and Top to Bottom alignment.
            </p>
            <p>
              This will make it easier for learners to identify phonemes in words as this is the normal reading alignment.
            </p>
          </div>
        </div>

        {/* Right: video embed */}
        <div className="w-full md:w-[46%] flex flex-col gap-2">
          <span className="text-gray-400 text-sm">Video:</span>
          <div className="border border-[var(--border)] rounded overflow-hidden aspect-video bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/V0CzY8CkjVw"
              title="Assessment video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
