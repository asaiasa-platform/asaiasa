import { screen } from "@testing-library/react";
import { OrganizationCard } from "@/features/orgs/components/OrgCard";
import { getLangList, renderWithIntl } from "./renderUtilsWithInt";

describe("OrganizationCard", () => {
  const langList = getLangList();

  langList.forEach((lang) => {
    test("renders OrganizationCard component", () => {
      renderWithIntl(
        <OrganizationCard
          id={1}
          name="ไทยสตาร์ทอัพ"
          picUrl={"https://drive.google.com/uc?export=view&id="}
          province={""}
          country={""}
          industries={[]}
          headline={""}
          locale={""}
        />,
        { locale: lang }
      );
      const element = screen.getByText(/ไทยสตาร์ทอัพ/i);
      expect(element).toBeInTheDocument();
    });

    test("renders OrganizationCard component with different props", () => {
      renderWithIntl(
        <OrganizationCard
          id={1}
          name="SEA Bridge Talent"
          picUrl={"https://drive.google.com/uc?export=view&id="}
          province={""}
          country={""}
          industries={[]}
          headline={""}
          locale={""}
        />,
        { locale: lang }
      );
      const element = screen.getByText(/SEA Bridge Talent/i);
      expect(element).toBeInTheDocument();
    });

    test("check if the image is rendered", () => {
      renderWithIntl(
        <OrganizationCard
          id={1}
          name="SEA Bridge Talent"
          picUrl={"https://drive.google.com/uc?export=view&id="}
          province={""}
          country={""}
          industries={[]}
          headline={""}
          locale={""}
        />,
        { locale: lang }
      );
      const element = screen.getByRole("img");
      expect(element).toBeInTheDocument();
    });
  });
});
