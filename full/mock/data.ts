export const mockUser = {
	id: 'mockUserId',
	name: 'mockUser',
	email: 'mock@email.com',
	phone: '13012341234',
	rank: 3,
};

export const mockProject = {
	id: 'mockProjectId',
	name: '某某项目',
	owner: '业主单位',
};

export const mockProjects = [
	mockProject,
	{
		id: 'mockProjectId2',
		name: '某某项目2',
		owner: '业主单位2',
	},
	{
		id: 'mockProjectId3',
		name: '某某项目3',
		owner: '业主单位3',
	},
];

export const getMockProject = (id: string) => {
	for (let i = 0; i < mockProjects.length; i++) {
		if (mockProjects[i].id === id) return mockProjects[i];
	}
	return null;
};

export const mockMember = {
	id: 'mockMemberId',
	status: 0,
	isAdmin: true,
	user: mockUser,
	userId: 'mockUserId',
	project: mockProject,
	projectId: 'mockProjectId',
};

export const mockPerms = [];

export const mockToken = 'mockToken';
