import Head from "next/head";
import React from "react";

interface VerificationEmailTemplateProps {
  firstName: string;
  token: string;
}

export function VerificationEmailTemplate({
  firstName,
  token,
}: VerificationEmailTemplateProps) {
  return (
    <html>
      <Head>
        <title>Confirm Your Email</title>
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
                  Confirm Your Email
                </h1>
                <p
                  style={{
                    textAlign: "center",
                    color: "#555",
                    margin: "0 0 20px",
                  }}
                >
                  Hello {firstName},
                </p>
                <p
                  style={{
                    textAlign: "center",
                    color: "#555",
                    margin: "0 0 20px",
                  }}
                >
                  Thank you for signing up! To finish, please click the button
                  below:
                </p>
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <a
                    href={token}
                    style={{
                      display: "inline-block",
                      padding: "12px 24px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontWeight: 500,
                    }}
                  >
                    Verify Email
                  </a>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    margin: "10px 0",
                  }}
                >
                  Note: This link will expire in 5 minutes. If you didn’t
                  request this, you can safely ignore this email.
                </p>
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                    margin: "10px 0",
                  }}
                >
                  Need assistance? Please email us at{" "}
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
