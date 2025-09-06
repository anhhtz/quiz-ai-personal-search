"use client";
import {
  Box,
  Button,
  Card,
  Center,
  Group,
  LoadingOverlay,
  Space,
  Table,
  TextInput,
} from "@mantine/core";

import ky from "ky";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const router = useRouter();

  async function handleSearch() {
    const clearedKeyword = keyword.trim().toLowerCase();
    if (!clearedKeyword || clearedKeyword.length < 2) return;
    setIsLoading(true);

    try {
      // post data search to server using ky.post
      const response = await ky
        .post("/api/search/kns", {
          json: { keyword: clearedKeyword, action: "search_kns" },
        })
        .json<{ data: any[] }>();

      const data = response.data; // array of `Hits`
      if (data && data.length > 0) {
        setSearchResults(data);
      }

      setIsLoading(false);
      // console.debug(data);
    } catch (error) {
      // console.error(error);
      setIsLoading(false);
    }
  }

  const highlightResult = (str: string) => {
    str = str
      .replace(/<em>/g, '<span style="background-color: yellow;">')
      .replace(/<\/em>/g, "</span>");

    return <div dangerouslySetInnerHTML={{ __html: str }}></div>;
  };

  const rows = searchResults.map((element) => (
    <Table.Tr key={element.objectID}>
      <Table.Td>
        {highlightResult(element._highlightResult.question.value)}
      </Table.Td>
      <Table.Td>{element.correctAnswer}</Table.Td>
    </Table.Tr>
  ));
  /**
   * renderUI
   */

  return (
    <>
      <Card padding="sm">
        <Box pos={"relative"}>
          <LoadingOverlay visible={isLoading} />
          <TextInput
            placeholder="Nhập nội dung muốn tra cứu..."
            size="lg"
            radius={"xl"}
            value={keyword}
            onChange={(e: any) => {
              setKeyword(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          ></TextInput>
          <Space h="sm" />

          <Center>
            <Group gap={"md"}>
              <Button
                radius={"xl"}
                w={180}
                onClick={handleSearch}
                size="sm"
                color="blue"
              >
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                radius={"xl"}
                w={150}
                color="gray"
                onClick={() => {
                  setKeyword("");
                  setSearchResults([]);
                }}
              >
                Clear
              </Button>
            </Group>
          </Center>
        </Box>
      </Card>

      {searchResults.length > 0 && (
        <Card mt="sm" padding="sm" withBorder>
          <Card.Section>
            <Box>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Question</Table.Th>
                    <Table.Th>Answer</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Box>
          </Card.Section>
        </Card>
      )}
    </>
  );
}
