import { describe, it, expect } from "vitest";
import { parseBtcBalance, parseSbtcBalance } from "./balance-utils";

describe("parseBtcBalance", () => {
  it("parses valid response", () => {
    const response = {
      chain_stats: { funded_txo_sum: 100000000, spent_txo_sum: 50000000 },
    };
    expect(parseBtcBalance(response)).toBe(0.5);
  });

  it("returns 0 for null/undefined", () => {
    expect(parseBtcBalance(null)).toBe(0);
    expect(parseBtcBalance(undefined)).toBe(0);
  });

  it("returns 0 for malformed response", () => {
    expect(parseBtcBalance({})).toBe(0);
    expect(parseBtcBalance({ chain_stats: {} })).toBe(0);
    expect(parseBtcBalance("invalid")).toBe(0);
  });
});

describe("parseSbtcBalance", () => {
  const deployer = "SP000000000000000000002Q6VF78";

  it("parses valid response", () => {
    const response = {
      results: [
        { token: `${deployer}.sbtc-token::sbtc-token`, balance: "123456" },
      ],
    };
    expect(parseSbtcBalance(response, deployer)).toBe(BigInt(123456));
  });

  it("returns 0n when token not found", () => {
    const response = {
      results: [{ token: "OTHER.token::token", balance: "999" }],
    };
    expect(parseSbtcBalance(response, deployer)).toBe(BigInt(0));
  });

  it("returns 0n for null/undefined", () => {
    expect(parseSbtcBalance(null, deployer)).toBe(BigInt(0));
    expect(parseSbtcBalance(undefined, deployer)).toBe(BigInt(0));
  });

  it("returns 0n for malformed response", () => {
    expect(parseSbtcBalance({}, deployer)).toBe(BigInt(0));
    expect(parseSbtcBalance({ results: null }, deployer)).toBe(BigInt(0));
  });
});

