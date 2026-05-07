import { randomUUID } from "node:crypto";
import { prisma } from "@/src/plugins/prisma";
import { createAdminDeposit, type AdminDepositInput } from "@/src/services/admin-deposit.service";

type CliOptions = {
    amount?: number;
    userId?: string;
    email?: string;
    taxId?: string;
    referenceId?: string;
    description?: string;
    help?: boolean;
};

function usage() {
    return [
        "Usage:",
        "  npm run admin:deposit -- --email user@example.com --amount 1000",
        "  npm run admin:deposit -- --tax-id 12345678 --amount 1000 --description \"Manual bank deposit\"",
        "",
        "Options:",
        "  --amount <integer>       Amount in the same unit used by the API",
        "  --email <email>          Target user email",
        "  --tax-id <taxId>         Target user tax ID",
        "  --user-id <uuid>         Target user ID",
        "  --reference <value>      Optional ledger reference ID",
        "  --description <text>     Optional transaction description",
        "",
        "Safety:",
        "  Set ALLOW_ADMIN_DEPOSIT=true before running this script.",
    ].join("\n");
}

function readOptionValue(args: string[], index: number, name: string) {
    const value = args[index + 1];

    if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${name}`);
    }

    return value;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {};

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];

        if (!arg) {
            continue;
        }

        const [name, inlineValue] = arg.split("=", 2);

        switch (name) {
            case "--help":
            case "-h":
                options.help = true;
                break;
            case "--amount": {
                const rawValue = inlineValue ?? readOptionValue(args, index, name);
                options.amount = Number(rawValue);
                index += inlineValue ? 0 : 1;
                break;
            }
            case "--email":
                options.email = inlineValue ?? readOptionValue(args, index, name);
                index += inlineValue ? 0 : 1;
                break;
            case "--tax-id":
                options.taxId = inlineValue ?? readOptionValue(args, index, name);
                index += inlineValue ? 0 : 1;
                break;
            case "--user-id":
                options.userId = inlineValue ?? readOptionValue(args, index, name);
                index += inlineValue ? 0 : 1;
                break;
            case "--reference":
                options.referenceId = inlineValue ?? readOptionValue(args, index, name);
                index += inlineValue ? 0 : 1;
                break;
            case "--description":
                options.description = inlineValue ?? readOptionValue(args, index, name);
                index += inlineValue ? 0 : 1;
                break;
            default:
                throw new Error(`Unknown option: ${arg}`);
        }
    }

    return options;
}

function buildInput(options: CliOptions): AdminDepositInput {
    const selectors = [options.userId, options.email, options.taxId].filter(Boolean);
    const amount = options.amount;

    if (selectors.length !== 1) {
        throw new Error("Provide exactly one target selector: --user-id, --email or --tax-id");
    }

    if (typeof amount !== "number" || !Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("--amount must be a positive integer");
    }

    const baseInput = {
        amount,
        referenceId: options.referenceId ?? `admin-bank-deposit:${randomUUID()}`,
        ...(options.description ? { description: options.description } : {}),
    };

    if (options.userId) {
        return {
            ...baseInput,
            userId: options.userId,
        };
    }

    if (options.email) {
        return {
            ...baseInput,
            email: options.email,
        };
    }

    return {
        ...baseInput,
        taxId: options.taxId as string,
    };
}

async function main() {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
        console.log(usage());
        return;
    }

    if (process.env.ALLOW_ADMIN_DEPOSIT !== "true") {
        throw new Error("Refusing to run. Set ALLOW_ADMIN_DEPOSIT=true to enable admin deposits.");
    }

    const result = await createAdminDeposit(buildInput(options));

    if (!result.success) {
        throw new Error(result.error);
    }

    console.log(JSON.stringify(result, null, 2));
}

main()
    .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        console.error("");
        console.error(usage());
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
