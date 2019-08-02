import ManagementTable from "../ManagementTable";
import React from "react";
import { render } from "testUtils";

const mockWorkerData = [
  {
    attributes: {
      full_name: "Test 1"
    },
    id: "n1234567",
    sid: "WK054367358673954087634"
  },
  {
    attributes: {
      full_name: "Test 2"
    },
    id: "n0999999",
    sid: "WK054367358673954087634"
  },
  {
    attributes: {
      full_name: "Test 3"
    },
    id: "n0498575",
    sid: "WK054367358673954087634"
  }
];

describe("<ManagementTable />", () => {
  test("with no workers, we should just render a header.", () => {
    const rendered = render(<ManagementTable workers={[]} />);
    expect(rendered.getByText("NAME", { selector: "th" })).toBeInTheDocument();
    expect(rendered.getByText("N NUMBER", { selector: "th" })).toBeInTheDocument();
  });
  test("with workers, we should display each, along with a remove button.", () => {
    const rendered = render(<ManagementTable workers={mockWorkerData} />);
    expect(rendered.getByText("Test 1", { selector: "td" })).toBeInTheDocument();
    expect(rendered.getByText("Test 2", { selector: "td" })).toBeInTheDocument();
    expect(rendered.getByText("Test 3", { selector: "td" })).toBeInTheDocument();
    expect(rendered.getByText("n1234567", { selector: "td" })).toBeInTheDocument();
    expect(rendered.getByText("n0999999", { selector: "td" })).toBeInTheDocument();
    expect(rendered.getByText("n0498575", { selector: "td" })).toBeInTheDocument();
    expect(rendered.getAllByText("Remove", { selector: "button" }).length).toBe(3);
  });
});