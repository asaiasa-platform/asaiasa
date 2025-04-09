import EventCard from "@/components/common/EventCard";
import { screen } from "@testing-library/react";
import { getLangList, renderWithIntl } from "./renderUtilsWithInt";

describe("EventCard", () => {
  const langList = getLangList();

  langList.forEach((lang) => {
    test("renders EventCard component", () => {
      renderWithIntl(
        <EventCard
          title="งานทดสอบ"
          startDate="2024-11-16T00:00:00.000Z"
          endDate="2024-11-20T00:00:00.000Z"
          startTime="0001-01-01T09:00:00.000Z"
          endTime="0001-01-01T16:30:00.000Z"
          location="สถานที่"
          imgUrl="https://drive.google.com/uc?export=view&id=1-wqxOT_uo1pE_mEPHbJVoirMMH2Be3Ks"
          orgName="องค์กรทดสอบ"
          orgPicUrl="https://drive.google.com/uc?export=view&id=1-wqxOT_uo1pE_mEPHbJVoirMMH2Be3Ks"
          cardId="1"
          orgId={0}
          categories={[]}
          locationType="onsite"
        />,
        { locale: lang }
      );
      const element = screen.getByText(/งานทดสอบ/i);
      expect(element).toBeInTheDocument();
    });
  });
});
