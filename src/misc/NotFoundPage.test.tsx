import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NotFoundPage } from "./NotFoundPage";

test("renders learn react link", () => {
  render(
    <BrowserRouter>
      <NotFoundPage />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Not found/);
  expect(linkElement).toBeInTheDocument();
});
