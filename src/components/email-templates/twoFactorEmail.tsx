import Head from "next/head";
import React from "react";

interface TwoFactorEmailTemplateProps {
  otp: string;
}

export function TwoFactorEmailTemplate({ otp }: TwoFactorEmailTemplateProps) {
  return (
    <html>
      <Head>
        <title>Your 2FA Code</title>
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "20px" }}>
                <h1
                  style={{
                    textAlign: "center",
                    color: "#333",
                    margin: "0 0 10px",
                  }}
                >
                  Your Two-Factor Authentication Code
                </h1>

                <p
                  style={{
                    textAlign: "center",
                    color: "#555",
                    margin: "0 0 20px",
                  }}
                >
                  To complete your login, please use the following one-time
                  code:
                </p>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: "20px 0",
                    color: "#000",
                  }}
                >
                  {otp}
                </div>

                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    margin: "10px 0",
                  }}
                >
                  This code will expire in 5 minutes. If you didn’t request
                  this, you can safely ignore this email.
                </p>

                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    margin: "10px 0",
                  }}
                >
                  For assistance, please email us at{" "}
                  <a
                    href="mailto:support@xvariate.com"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    support@xvariate.com
                  </a>
                  .
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
