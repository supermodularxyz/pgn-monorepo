import { useFormContext } from "react-hook-form";

import { usePGN } from "..";
import { useTokenAddresses } from "../hooks/useSelectedToken";
import { Label, Select } from "./ui/Form";

export function TokenSelect() {
  const form = useFormContext();
  const { tokens } = usePGN();
  const getToken = useTokenAddresses();
  return (
    <div>
      <Label>
        Asset
        <Select
          disabled={form.formState.isSubmitting}
          {...form.register("token")}
        >
          {tokens.map((token) => {
            const [address] = getToken(token);
            return (
              <option key={token.name} value={address}>
                {token.name}
              </option>
            );
          })}
        </Select>
      </Label>
    </div>
  );
}
