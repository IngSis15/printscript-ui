import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";
import {axiosInstance} from "./axios.config.ts";

export class SnippetOperationImpl implements SnippetOperations {
  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const body = {
      ...createSnippet,
      description: "",
      version: "1.1"
    }

    return axiosInstance.post("/snippet/v1/snippet", {
      body
    })
  }

  deleteSnippet(id: string): Promise<string> {
    return Promise.resolve("");
  }

  formatSnippet(snippet: string): Promise<string> {
    return Promise.resolve("");
  }

  getFileTypes(): Promise<FileType[]> {
    return Promise.resolve([
      {
        language: "printscript",
        extension: "ps"
      }
    ])
  }

  getFormatRules(): Promise<Rule[]> {
    return Promise.resolve([]);
  }

  getLintingRules(): Promise<Rule[]> {
    return Promise.resolve([]);
  }

  getSnippetById(id: string): Promise<Snippet | undefined> {
    return Promise.resolve(undefined);
  }

  getTestCases(): Promise<TestCase[]> {
    return Promise.resolve([]);
  }

  getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
    return Promise.resolve(undefined);
  }

  listSnippetDescriptors(page: number, pageSize: number, sippetName?: string): Promise<PaginatedSnippets> {
    return Promise.resolve(undefined);
  }

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    return Promise.resolve([]);
  }

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    return Promise.resolve([]);
  }

  postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
    return Promise.resolve(undefined);
  }

  removeTestCase(id: string): Promise<string> {
    return Promise.resolve("");
  }

  shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    return Promise.resolve(undefined);
  }

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    return Promise.resolve(undefined);
  }

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
    return Promise.resolve(undefined);
  }
}
