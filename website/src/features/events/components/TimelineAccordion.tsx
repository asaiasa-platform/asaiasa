import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface TimelineAccordionProps {
  timelineArr: Array<{
    date: string;
    content: string;
  }>;
}

export default function TimelineAccordion({
  timelineArr,
}: Readonly<TimelineAccordionProps>) {
  if (timelineArr.length === 0) return;
  return (
    <Accordion
      type="multiple"
      className="w-full border rounded-[10px] bg-[#F4F4F5] px-5"
    >
      {timelineArr.map((day, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{day.date}</AccordionTrigger>
          <AccordionContent>{day.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
