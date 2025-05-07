"use client";

import { AboutDynamicZone, WhatWeDoSection as WhatWeDoSectionType } from "../types";
import RichTextSection from "./RichTextSection";
import TeamSection from "./TeamSection";
import WhatWeDoContainer from "./WhatWeDoContainer";

interface Props {
  blocks: AboutDynamicZone[];
}

export default function DynamicZoneRenderer({ blocks }: Props) {
  // Group WhatWeDo sections
  const whatWeDoSections: WhatWeDoSectionType[] = blocks.filter(
    (block): block is WhatWeDoSectionType => 
      block.__component === "about.what-we-do-section"
  );
  
  // Filter out WhatWeDo sections from the main blocks
  const otherBlocks = blocks.filter(
    block => block.__component !== "about.what-we-do-section"
  );

  return (
    <div>
      {/* Render all non-WhatWeDo sections */}
      {otherBlocks.map((block, index) => {
        switch (block.__component) {
          case "about.rich-text-section":
            return <RichTextSection key={block.id || index} data={block} />;
          case "about.team-section":
            return <TeamSection key={block.id || index} data={block} />;
          default:
            return null;
        }
      })}
      
      {/* Render grouped WhatWeDo sections */}
      {whatWeDoSections.length > 0 && (
        <WhatWeDoContainer sections={whatWeDoSections} />
      )}
    </div>
  );
} 