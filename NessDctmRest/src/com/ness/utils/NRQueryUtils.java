package com.ness.utils;

import com.documentum.fc.client.DfQuery;
import com.documentum.fc.client.IDfCollection;
import com.documentum.fc.client.IDfQuery;
import com.documentum.fc.client.IDfSession;

public class NRQueryUtils {

	public static IDfCollection executeSelectQuery(IDfSession session, String query, String [] params) throws Exception{
		IDfQuery idfQuery = new DfQuery();
		idfQuery.setDQL(NRUtils.buildText(query, params));
		return idfQuery.execute(session, IDfQuery.DF_READ_QUERY);
	}
}
