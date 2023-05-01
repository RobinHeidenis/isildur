import { sub } from "@isildur/api";
import { Button } from "ui";

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      {sub(1, 2)}
      <Button />
    </div>
  );
}
