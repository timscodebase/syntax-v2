import { transcript_with_utterances } from '$server/ai/queries';
import { get_show_cache_ms } from '$utilities/get_show_cache_ms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function ({ setHeaders, params, locals, parent }) {
	const { show } = await parent();
	const cache_ms = get_show_cache_ms(show.date);
	setHeaders({
		'cache-control': `public s-max-age=${cache_ms}, stale-while-revalidate=${cache_ms}`
	});
	const { show_number } = params;

	return {
		transcript: locals.prisma.transcript.findUnique({
			where: { show_number: parseInt(show_number) },
			...transcript_with_utterances
		})
	};
};