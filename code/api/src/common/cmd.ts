import { spawn } from 'child_process';

export const cmd = (
	arr: string[] = [],
	env = {},
	isShell = false,
	workspace = __dirname,
	isContinuingLogs = false
) => {
	const c0 = arr[0];
	const params = arr.slice(1);

	return new Promise<{ code: number; msg: string }>((resolve, reject) => {
		const ssp = spawn(c0, params, {
			stdio: 'pipe',
			cwd: workspace,
			env: { ...process.env, ...env },
			shell: isShell
		});

		const msgArr: string[] = [];
		// const re = new RegExp('[\n\t\r]', 'g');

		ssp.stdout?.setEncoding('utf8');
		ssp.stderr?.setEncoding('utf8');
		ssp.stdout?.on('data', function (data: string) {
			const dd = data?.toString() ?? '';
			// msgArr.push(dd.replace(re, ''));
			if (isContinuingLogs) {
				console.log(data);
			}
			msgArr.push(dd);
		});
		ssp.stderr?.on('data', function (data: string) {
			const dd = data?.toString() ?? '';
			// msgArr.push(dd.replace(re, ''));
			msgArr.push(dd);
		});
		ssp.on('close', (code: number) => {
			const msg = msgArr.filter((a) => !!a).join('');
			// console.log(`==> exist code:${code}`);
			resolve({ code: code ?? -1, msg });
		});
		ssp.on('error', function (err: Error) {
			// const msg = msgArr.filter(a => !!a).join('');
			// console.log(err.message);
			reject({ code: 999, msg: err.message });
		});
	});
};
