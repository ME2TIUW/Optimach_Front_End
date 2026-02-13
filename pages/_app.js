import "@/styles/globals.css";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "../config/axios/axios";
import { SWRDevTools } from "swr-devtools";

export default function App({ Component, pageProps }) {
  return (
      <CustomProvider>
        <SWRDevTools>
        <Component {...pageProps} />{" "}
        </SWRDevTools>
      </CustomProvider>
  );
}
