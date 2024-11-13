import { SnippetOperations } from './snippetOperations.ts';
import {
  CreateSnippet,
  PaginatedSnippets,
  Snippet,
  UpdateSnippet,
} from './snippet.ts';
import { FileType } from '../types/FileType.ts';
import { Rule } from '../types/Rule.ts';
import { TestCase } from '../types/TestCase.ts';
import { PaginatedUsers, User } from './users.ts';
import { TestCaseResult } from './queries.tsx';
import { axiosInstance } from './axios.config.ts';

export class SnippetOperationImpl implements SnippetOperations {
  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const body = {
      ...createSnippet,
      description: '',
      version: '1.1',
    };

    try {
      const response = await axiosInstance.post('/snippet/v1/snippet', body);
      return response.data as Snippet;
    } catch (e) {
      throw new Error('Snippet creation failed');
    }
  }

  async deleteSnippet(id: string): Promise<string> {
    try {
      await axiosInstance.delete(`/snippet/v1/snippet/${id}`);
      return id;
    } catch (e) {
      throw new Error('Snippet deletion failed');
    }
  }

  formatSnippet(_snippet: string): Promise<string> {
    return Promise.resolve(''); // Placeholder implementation
  }

  async getFileTypes(): Promise<FileType[]> {
    return [
      {
        language: 'printscript',
        extension: 'ps',
      },
    ];
  }

  async getFormatRules(): Promise<Rule[]> {
    try {
      const response = await axiosInstance.get('/snippet/v1/config/formatting');
      return this.jsonToRules(response.data);
    } catch (e) {
      throw new Error('Fetching format rules failed');
    }
  }

  async getLintingRules(): Promise<Rule[]> {
    try {
      const response = await axiosInstance.get('/snippet/v1/config/linting');
      return this.jsonToRules(response.data);
    } catch (e) {
      throw new Error('Fetching linting rules failed');
    }
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {
    try {
      const response = await axiosInstance.get(`/snippet/v1/snippet/${id}`);
      return response.data as Snippet;
    } catch (e) {
      console.error(e);
    }
  }

  async getUserFriends(
    _name?: string,
    _page?: number,
    _pageSize?: number,
  ): Promise<PaginatedUsers> {
    try {
      const response = await axiosInstance.get('/permission/users');
      const data = response.data;

      return {
        page: 1,
        page_size: 99,
        count: data.length,
        users: data.map(
          (user: any): User => ({
            name: user.name,
            id: user.user_id,
          }),
        ),
      };
    } catch (e) {
      throw new Error('Fetching user friends failed');
    }
  }

  async listSnippetDescriptors(
    page: number,
    pageSize: number,
    _snippetName?: string,
  ): Promise<PaginatedSnippets> {
    try {
      const response = await axiosInstance.get('/snippet/v1/snippet', {
        params: { page, size: pageSize },
      });
      const data = response.data;

      return {
        snippets: data.content,
        page: data.pageable.pageNumber + 1,
        page_size: data.pageable.pageSize,
        count: data.totalElements,
      };
    } catch (e) {
      throw new Error('Failed to fetch snippet descriptors');
    }
  }

  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    try {
      const response = await axiosInstance.put(
        '/snippet/v1/config/formatting',
        this.rulesToJson(newRules),
      );
      return this.jsonToRules(response.data);
    } catch (e) {
      throw new Error('Failed modifying format rules');
    }
  }

  async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    try {
      const response = await axiosInstance.put(
        '/snippet/v1/config/linting',
        this.rulesToJson(newRules),
      );
      return this.jsonToRules(response.data);
    } catch (e) {
      throw new Error('Failed modifying linting rules');
    }
  }

  async postTestCase(_testCase: Partial<TestCase>): Promise<TestCase> {
    throw new Error('Method not implemented.');
  }

  async removeTestCase(_id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async shareSnippet(_snippetId: string, _userId: string): Promise<Snippet> {
    throw new Error('Method not implemented.');
  }

  async testSnippet(_testCase: Partial<TestCase>): Promise<TestCaseResult> {
    throw new Error('Method not implemented.');
  }

  async updateSnippetById(
    id: string,
    updateSnippet: UpdateSnippet,
  ): Promise<Snippet> {
    const body = {
      ...updateSnippet,
      description: '',
      version: '1.1',
    };

    try {
      const response = await axiosInstance.post(
        `/snippet/v1/snippet/${id}`,
        body,
      );
      return response.data as Snippet;
    } catch (e) {
      throw new Error('Snippet update failed');
    }
  }

  rulesToJson(rules: Rule[]): { [key: string]: string | number | boolean } {
    return rules.reduce(
      (acc: { [key: string]: string | number | boolean }, rule) => {
        if (rule.isActive && rule.value !== null && rule.value !== undefined) {
          acc[rule.name] = rule.value;
        } else if (rule.value === null || rule.value === undefined) {
          acc[rule.name] = rule.isActive;
        }
        return acc;
      },
      {},
    );
  }

  jsonToRules(json: { [key: string]: string | number | boolean }): Rule[] {
    return Object.keys(json).map((key, index) => {
      const value = json[key];
      return {
        id: index.toString(),
        name: key,
        isActive: typeof value === 'boolean' ? value : true,
        value: typeof value !== 'boolean' ? value : null,
      };
    });
  }

  getTestCases(): Promise<TestCase[]> {
    return Promise.resolve([]);
  }
}
