import { MockMethod } from 'vite-plugin-mock';
// import Mock from 'mockjs';

import { mockUser, mockToken, mockProjects, getMockProject, mockMember, mockPerms } from './data';

export default [
	{
		url: '/api/auth/login',
		method: 'post',
		response: () => ({
			code: 0,
			data: {
				user: mockUser,
				token: mockToken,
			},
		}),
	},

	{
		url: '/api/auth/info',
		method: 'get',
		response: ({ query }) => {
			const { projectId } = query;
			return {
				code: 0,
				data: {
					user: mockUser,
					project: getMockProject(projectId),
					member: projectId ? mockMember : null,
					perms: projectId ? mockPerms : null,
				},
			};
		},
	},

	{
		url: '/api/project/items',
		method: 'get',
		response: () => ({
			code: 0,
			data: mockProjects,
		}),
	},
] as MockMethod[];
