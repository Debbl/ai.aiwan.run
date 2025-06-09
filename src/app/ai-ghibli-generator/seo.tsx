import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/animate-ui/radix/accordion'

export function SEO() {
  const List = [
    {
      question: 'Is the AI Ghibli Generator free?',
      answer: `Yes, it's 100% free to start! Simply register an account and you'll instantly receive 100 free credits to create Ghibli-style magic. No payment required!`,
    },
    {
      question: 'How long does it take to generate an image?',
      answer: `Yes, it's 100% free to start! Simply register an account and you'll instantly receive 100 free credits to create Ghibli-style magic. No payment required!`,
    },
    {
      question: 'What styles or Studio Ghibli movies does the AI mimic?',
      answer: `Our AI is trained to replicate the iconic aesthetic of Studio Ghibli films like My Neighbor Totoro, Spirited Away, Princess Mononoke, and Howl's Moving Castle. Expect soft watercolor textures, whimsical characters, and dreamy landscapes!`,
    },
    {
      question: 'What image resolution do you support?',
      answer: `Images generate at 1024x1024 pixels by default—perfect for social media, prints, or digital wallpapers. Higher resolutions may be added in the future!`,
    },
    {
      question: 'Can I download my artwork?',
      answer: `Absolutely! Every generated image is yours to keep. Download high-resolution (1024x1024) files instantly for personal or commercial use.`,
    },
    {
      question: 'Do unused credits expire?',
      answer: `No. Your credits remain in your account until used. Unused credits? No stress!`,
    },
    {
      question: 'How long does image generation take?',
      answer: `Typically 10-30 seconds. Complex prompts or high traffic may cause slight delays. Pro tip: Bookmark your gallery to check completed artworks later!`,
    },
  ]
  return (
    <div className='py-4'>
      <Accordion
        type='single'
        defaultValue='item-0'
        collapsible
        className='mx-auto max-w-[400px]'
      >
        {List.map((i, index) => (
          <AccordionItem value={`item-${index}`} key={i.question}>
            <AccordionTrigger>{i.question}</AccordionTrigger>
            <AccordionContent>{i.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
