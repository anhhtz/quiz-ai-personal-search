import { createClient } from '@supabase/supabase-js';

const options = {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
	global: {},
};

// export default supabase;
export const getSupabase = schema => {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		// process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		process.env.SUPABASE_SECRET_KEY,
		{
			...options,
			db: {
				schema,
			},
		},
	);
};
