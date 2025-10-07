import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("locale")?.value || "fr";

  return {
    locale: locale,
    messages: (await import(`../app/messages/${locale}.json`)).default,
  };
});
