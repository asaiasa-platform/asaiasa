import JobCard from "@/components/common/JobCard";
import { screen } from "@testing-library/react";
import { getLangList, renderWithIntl } from "./renderUtilsWithInt";

describe("JobCard", () => {
  const langList = getLangList();

  langList.forEach((lang) => {
    test("renders JobCard component", () => {
      renderWithIntl(
        <JobCard
          title="พนักงานทดสอบ 1"
          description="สร้างเว็บไซต์ให้บริษัททดสอบ 1 ของคุณ"
          workType="Fulltime"
          workplace="Hybrid"
          careerStage="Entry-Level"
          province="กรุงเทพมหานคร"
          country="ประเทศไทย"
          salary={30000}
          id={0}
          updatedAt={""}
          categories={[
            { value: 1, label: "IT" },
            { value: 2, label: "เทคโนโลยี" },
            { value: 3, label: "องค์กร" },
            { value: 4, label: "งานทดสอบ" },
          ]}
          organization={{
            id: 0,
            name: "test",
            picUrl:
              "https://drive.google.com/uc?export=view&id=1bsT5WNkFnhhGT7SD3AynO9gqDjzz17lc",
          }}
        />,
        { locale: lang }
      ); // ARRANGE
      const element = screen.getByText(/พนักงานทดสอบ 1/i); // ACT
      expect(element).toBeInTheDocument(); // ASSERT
    });

    test("renders JobCard component with different props", () => {
      renderWithIntl(
        <JobCard
          title="พนักงานทดสอบ 1"
          description="สร้างเว็บไซต์ให้บริษัททดสอบ 1 ของคุณ"
          workType="Fulltime"
          workplace="Hybrid"
          careerStage="Entry-Level"
          province="กรุงเทพมหานคร"
          country="ประเทศไทย"
          salary={30000}
          id={0}
          updatedAt={""}
          categories={[
            { value: 1, label: "IT" },
            { value: 2, label: "เทคโนโลยี" },
            { value: 3, label: "องค์กร" },
            { value: 4, label: "งานทดสอบ" },
          ]}
          organization={{
            id: 0,
            name: "test",
            picUrl:
              "https://drive.google.com/uc?export=view&id=1bsT5WNkFnhhGT7SD3AynO9gqDjzz17lc",
          }}
        />,
        { locale: lang }
      );
      const element = screen.getByText(/พนักงานทดสอบ 1/i);
      expect(element).toBeInTheDocument();
    });

    test("check if the image is rendered", () => {
      renderWithIntl(
        <JobCard
          title="พนักงานทดสอบ 1"
          description="สร้างเว็บไซต์ให้บริษัททดสอบ 1 ของคุณ"
          workType="Fulltime"
          workplace="Hybrid"
          careerStage="Entry-Level"
          province="กรุงเทพมหานคร"
          country="ประเทศไทย"
          salary={30000}
          id={0}
          updatedAt={""}
          categories={[
            { value: 1, label: "IT" },
            { value: 2, label: "เทคโนโลยี" },
            { value: 3, label: "องค์กร" },
            { value: 4, label: "งานทดสอบ" },
          ]}
          organization={{
            id: 0,
            name: "test",
            picUrl:
              "https://drive.google.com/uc?export=view&id=1bsT5WNkFnhhGT7SD3AynO9gqDjzz17lc",
          }}
        />,
        { locale: lang }
      );
      const element = screen.getByRole("img");
      expect(element).toBeInTheDocument();
    });

    test("check types of props", () => {
      renderWithIntl(
        <JobCard
          title="พนักงานทดสอบ 1"
          description="สร้างเว็บไซต์ให้บริษัททดสอบ 1 ของคุณ"
          workType="Fulltime"
          workplace="Hybrid"
          careerStage="Entry-Level"
          province="กรุงเทพมหานคร"
          country="ประเทศไทย"
          salary={30000}
          id={0}
          updatedAt={""}
          categories={[
            { value: 1, label: "IT" },
            { value: 2, label: "เทคโนโลยี" },
            { value: 3, label: "องค์กร" },
            { value: 4, label: "งานทดสอบ" },
          ]}
          organization={{
            id: 0,
            name: "test",
            picUrl:
              "https://drive.google.com/uc?export=view&id=1bsT5WNkFnhhGT7SD3AynO9gqDjzz17lc",
          }}
        />,
        { locale: lang }
      );

      const element2 = screen.getByRole("img");
      const element3 = screen.getByText(/งานทดสอบ 1/i);
      const element4 = screen.getByText(/Hybrid/i);

      expect(element2).toHaveAttribute("src");
      expect(element2).toHaveAttribute("alt");
      expect(element3).toHaveTextContent("พนักงานทดสอบ 1");
      expect(element4).toHaveTextContent("Hybrid");
    });
  });
});
