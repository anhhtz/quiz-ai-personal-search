'use client';
import { Code, Paper, Table, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";

export default  function DebugPage() {
const {data: session, status} = useSession();

if(process.env.NODE_ENV === "production")
  return <></>

  // Nếu không có session, chuyển hướng về trang login
  if (!session) {
  return <>Unauthorized</>
  }

  // Lấy thông tin chi tiết từ session
  const { user, expires,  } = session;

  // Dữ liệu để hiển thị trong bảng
  const debugData = [
    { key: "User", value: JSON.stringify(user, null, 2) },
    { key: "Session Expires", value: expires || "N/A" },
    { key: "Full Session", value: JSON.stringify(session, null, 2) },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa", padding: "20px" }}>
      <Paper shadow="md" p="xl" withBorder style={{ maxWidth: "100%", width: "100%" }}>
        <Title order={2} mb="lg">
          NextAuth Debug Information
        </Title>
        <Text mb="md">Below is the detailed information from the current NextAuth session.</Text>
        
        <Table withRowBorders withColumnBorders>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {debugData.map((item) => (
              <tr key={item.key}>
                <td style={{ width: "200px" }}>{item.key}</td>
                <td>
                  <Code block>{item.value}</Code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

       
      </Paper>
    </div>
  );
}