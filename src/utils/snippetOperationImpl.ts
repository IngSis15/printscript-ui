import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {PaginatedUsers, User} from "./users.ts";
import {TestCaseResult} from "./queries.tsx";
import {axiosInstance} from "./axios.config.ts";

export class SnippetOperationImpl implements SnippetOperations {
  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const body = {
      ...createSnippet,
      description: "",
      version: "1.1"
    }

    try {
      return axiosInstance.post("/snippet/v1/snippet", body)
    } catch (e) {
      throw new Error("Snippet creation failed");
    }
  }

  deleteSnippet(id: string): Promise<string> {
    return axiosInstance.delete(`/snippet/v1/snippet/${id}`)
  }

  formatSnippet(_snippet: string): Promise<string> {
    throw new Error("Not implemented")
  }

  getFileTypes(): Promise<FileType[]> {
    return Promise.resolve([
      {
        language: "printscript",
        extension: "ps"
      }
    ])
  }

  async getFormatRules(): Promise<Rule[]> {
    try {
      const response = await axiosInstance.get("/snippet/v1/config/formatting")
      const data = response.data
      return this.jsonToRules(data)
    } catch (e) {
      throw new Error("Fetching format rules failed")
    }
  }

  async getLintingRules(): Promise<Rule[]> {
    try {
      const response = await axiosInstance.get("/snippet/v1/config/linting")
      const data = response.data
      return this.jsonToRules(data)
    } catch (e) {
      throw new Error("Fetching linting rules failed");
    }
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {
    try {
      const response = await axiosInstance.get(`/snippet/v1/snippet/${id}`)
      return response.data
    } catch (e) {
      console.error(e)
    }
  }

  getTestCases(): Promise<TestCase[]> {
    throw new Error("Not implemented")
  }

  async getUserFriends(_name?: string, _page?: number, _pageSize?: number): Promise<PaginatedUsers> {
    try {
      const response = await axiosInstance.get("/permission/users")
      const data = response.data

      return {
        page: 1,
        page_size: 99,
        count: data.length,
        users: data.map((user: any): User => ({
          name: user.name,
          id: user.user_id,
        }))
      }
    } catch (e) {
      throw new Error("Fetching user friends failed");
    }
  }

  async listSnippetDescriptors(page: number, pageSize: number, _snippetName?: string): Promise<PaginatedSnippets> {
    try {
      const response = await axiosInstance.get("/snippet/v1/snippet", {
        params: {
          page,
          size: pageSize,
        }
      })

      const data = response.data;
      return {
        snippets: data.content,
        page: data.pageable.pageNumber + 1, // Adjusting for 1-based page index if needed
        page_size: data.pageable.pageSize,
        count: data.totalElements
      };
    } catch (e) {
      throw new Error("Failed to fetch snippet descriptors");
    }
  }

  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    try {
      const response = await axiosInstance.put("/snippet/v1/config/formatting", this.rulesToJson(newRules))
      return this.jsonToRules(response.data)
    } catch (e) {
      throw new Error("Failed modifying format rules")
    }
  }

  async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    try {
      const response = await axiosInstance.put("/snippet/v1/config/linting", this.rulesToJson(newRules))
      return this.jsonToRules(response.data)
    } catch (e) {
      throw new Error("Failed modifying linting rules")
    }
  }

  postTestCase(_testCase: Partial<TestCase>): Promise<TestCase> {
    throw new Error("Not implemented")
  }

  removeTestCase(_id: string): Promise<string> {
    throw new Error("Not implemented")
  }

  shareSnippet(_snippetId: string, _userId: string): Promise<Snippet> {
    throw new Error("Not implemented")
  }

  testSnippet(_testCase: Partial<TestCase>): Promise<TestCaseResult> {
    throw new Error("Not implemented")
  }

  async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
    const body = {
      ...updateSnippet,
      description: "",
      version: "1.1"
    }

    try {
      const response = await axiosInstance.post(`/snippet/v1/snippet/${id}`, body)
      return response.data as Snippet
    } catch (e) {
      console.error(e)
      throw new Error("Error updating snippet")
    }
  }

 rulesToJson(rules: Rule[]): { [key: string]: string | number | boolean } {
   return rules.reduce((acc: { [key: string]: string | number | boolean }, rule) => {
      if (rule.isActive && rule.value !== null && rule.value !== undefined) {
        acc[rule.name] = rule.value;
      } else if (rule.value === null || rule.value === undefined) {
        acc[rule.name] = rule.isActive;
      }
      return acc;
    }, {} as { [key: string]: string | number | boolean });
  }

  jsonToRules(json: { [key: string]: string | number | boolean }): Rule[] {
    return Object.keys(json).map((key, index) => {
      const value = json[key]
      return {
        id: index.toString(),
        name: key,
        isActive: typeof value === 'boolean' ? value : true,
        value: typeof value !== 'boolean' ? value : null
      }
    })
  }
}
