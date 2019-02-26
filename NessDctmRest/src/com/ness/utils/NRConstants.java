package com.ness.utils;

import java.util.HashMap;

public class NRConstants
{
	public static final char DOT = '.';
	public static final char ASTERISK = '*';
	public static final char CHAR_PERCENTAGE = '%';
	public static final char ZERO_CHAR = '0';
	public static final String EMPTY = "";
	public static final String SPACE = " ";
	public static final String SLASH = "/";
	public static final String BACKSLASH = "\\";
	public static final String COMMA = ",";
	public static final String UTF_PREFIX = "%04x";
	public static final String APOSTROPHE = "'";
	public static final String DOUBLE_APOSTROPHE = "''";
	public static final String QUOTE = "\"";
	public static final String DOUBLE_QUOTE = "\"\"";
	public static final String PLUS = "\\+";
	public static final String HTTP_HEADER_USER_NAME = "user_name";
	public static final String HTTP_HEADER_PASSWORD = "password";
	public static final String HTTP_HEADER_DOMAIN = "domain";
	public static final String HTTP_HEADER_DOCBASE = "docbase";
	public static final String DM_DOCUMENT = "dm_document";
	public static final String GOV_FOLDER = "gov_folder";
	public static final String GOV_DOCUMENT = "gov_document";
	public static final String GOV_UNIT_FOLDER = "gov_unit_folder";
	public static final String GOV_COURT_FOLDER = "gov_court_folder";
	public static final String GOV_REQUEST_FOLDER = "gov_request_folder";
	public static final String GOV_COMMITTEE_FOLDER = "gov_committee_folder";
	public static final String GOV_DISCIPLINE_FOLDER = "gov_discipline_folder";
	public static final String GOV_GIYUR_FOLDER = "gov_giyur_folder";
	public static final String GOV_MEETING_FOLDER = "gov_meeting_folder";
	public static final String SOURCE_EMAIL_CODE_NUMBER = "2";
	public static final String DM_CABINET = "dm_cabinet";
	public static final String GOV_ID = "gov_id";
	public static final String GOVID = "govId";
	public static final String F = "f";
	public static final String T = "t";
	public static final String FALSE = "false";
	public static final String TRUE = "true";
	public static final String ZERO = "0";
	public static final String ONE = "1";
	public static final String START_POS = "start_pos";
	public static final String ERROR_ATTRIBUTE_TYPE = "Unable to get attribute type for attribute %1";
	public static final String ERROR_NRSESSION_MANAGER_ONE = "NRSessionManager(getUserSession) - Docbase must be provided";
	public static final String PARAM_1 = "%1";
	public static final String PARAM_2 = "%2";
	public static final String PARAM_3 = "%3";
	public static final String PARAM_4 = "%4";
	public static final String OBJECT_SERVICE_VERSION = "1.0";
	public static final String VALIDATION_CLASS = "validationClass";
	public static final String AUTHORIZATION = "Authorization"; 
	public static final String AUTHENTICATION = "authentication";
	public static final String AUTHENTICATION_TYPE = "authenticationType";
	public static final String AUTH_BASIC = "basic";
	public static final String CONTROL_PROGRAM = "controlProgram";
	public static final String AUTH_GOV_SMART_CARD = "govsc";
	public static final String AUTH_KERBEROS = "kerberos";
	public static final String DOCBASE = "docbase";
	public static final String EPPN = "eppn";
	public static final String KJWT = "kjwt"; //kerberos Json Web Token
	public static final String NEGOTIATE = "Negotiate";
	public static final String KERBEROS_USERNAME = "kerberosUsername";
	public static final String HOME_FOLDER_ID = "-1";
	
	public static final String REQUEST_LOGIN_INFO = "loginInfo";
	public static final String CONFIG_FOLDER = "config/";
	public static final String OPTIONS = "options";
	public static final String DOCBASES = "docbases";
    public static final String NAME = "name";
    public static final String ORG_OFFICE = "org_office";
    public static final String COMPLAINT_DATE = "complaint_date"; 
    public static final String MIME_TYPE = "mime_type";
    public static final String DOS_EXTENSION = "dos_extension";
	public static final String UTF_8 = "UTF-8";
	public static final String ISO_8859_1 = "iso-8859-1";
	public static final String CONTENT_DISPOSITION = "Content-Disposition";
	public static final String ATTACHMENT = "attachment";
	public static final String FILE = "file";
	public static final String PDF = "pdf";
	public static final String MSG = "msg";
	public static final String A_CONTENT_TYPE = "a_content_type";
	public static final String DATA_TYPE_STRING = "2";
	
	//search by format
	public static final String FORMAT_SUBQUERY_WORD = "(a_content_type ='msw' or a_content_type like 'msw%' or a_content_type ='rtf')";
	public static final String FORMAT_SUBQUERY_EXCEL = "(a_content_type ='excel' or a_content_type like 'excel%')";
	public static final String FORMAT_SUBQUERY_PDF =  "(a_content_type ='pdf')";
	public static final String FORMAT_SUBQUERY_TIF = "(a_content_type in ('tif', 'tiff'))";
	public static final String FORMAT_SUBQUERY_IMAGE = "(a_content_type in ('jpg', 'jpeg','png','gif', 'bmp', 'svg'))";
	public static final String FORMAT_SUBQUERY_OUTLOOK = "(a_content_type in ('msg', 'eml'))";
	public static final String FORMAT_SUBQUERY_POWERPOINT = "(a_content_type ='ppt' or a_content_type like 'ppt%')";
	public static final String FORMAT_SUBQUERY_AUDIO = "(a_content_type in ('wav', 'mp3', 'wma', 'mid', 'ogg', 'ra', 'audio'))";
	public static final String FORMAT_SUBQUERY_VIDEO = "(a_content_type in ('avi', 'mpg','mkv', '3gp', 'swf', 'quicktime', 'mp4', 'video'))";
	public static final String FORMAT_SUBQUERY_TEXT = "(a_content_type in ('txt', 'log', 'asc', 'properties', 'cnf', 'conf'))";
	public static final String FORMAT_SUBQUERY_CSS = "(a_content_type ='css')";
	public static final String FORMAT_SUBQUERY_CSV = "(a_content_type ='csv')";
	public static final String FORMAT_SUBQUERY_HTML = "(a_content_type in ('html', 'htm'))";
	public static final String FORMAT_SUBQUERY_ARCHIVE = "(a_content_type in ('zip', 'rar', 'jar', 'war', 'tar', 'gzip') or a_content_type like 'tar%')";
	public static final String FORMAT_SUBQUERY_JAVA = "(a_content_type ='java' or a_content_type ='class' or a_content_type ='js')";
	public static final String FORMAT_SUBQUERY_XML = "(a_content_type ='xml')";
	public static final String FORMAT_SUBQUERY_AUTOCAD = "(a_content_type in ('dwg', 'dxf', 'dwfx', 'acad'))";
	
	public static final String R_OBJECT_TYPE = "r_object_type";
	public static final String R_CREATOR_NAME = "r_creator_name";
	public static final String R_OBJECT_ID = "r_object_id";
	public static final String I_ANCESTOR_ID = "i_ancestor_id";
	public static final String I_FOLDER_ID = "i_folder_id";
	public static final String R_LOCK_OWNER = "r_lock_owner";
	public static final String R_VERSION_LABEL = "r_version_label";
	public static final String I_CHRONICLE_ID = "i_chronicle_id";
	public static final String OBJECT_NAME = "object_name";
	public static final String DOC_DATE = "doc_date";
	public static final String ADDRESSEE_NAME = "addressee_name";
	public static final String ADDRESSEE_ID = "addressee_id";
	public static final String CC_NAME = "cc_name";
	public static final String CC_ID = "cc_id";
	public static final String FULL_NAME = "full_name";
	public static final String UNIT_LAYER_NAME = "unit_layer_name";
	public static final String OUTLOOK_ID = "outlook_id";
	public static final String GOV_OUTLOOK_FIELDS = "gov_outlook_fields";
	public static final String CLASSIFICATION = "classification";
	public static final String SENSITIVITY = "sensitivity";
	public static final String ID_NUMBER = "id_number";
	public static final String SENDER_ID = "sender_id";
	public static final String SENDER_NAME = "sender_name";
	public static final String LOCKED_BY_ME = "locked_by_me";
	public static final String PRIORITY = "priority";
	public static final String ORDER_NO = "order_no";
	public static final String USER_NAME = "user_name";
	public static final String CODE = "code";
	public static final String VALUE = "value";
	public static final String IS_TEMPLATE = "is_template";
	public static final String USER_AGENT = "User-Agent";
	public static final String FOLDER_IDS = "folderIds";
	public static final String FOLDER_ID = "folderId";
	public static final String COLUMNS_NAME = "columns_name";
	public static final String DOC_IDS = "docIds";
	public static final String OBJECT_IDS = "objectIds";
	public static final String USER_PERMIT = "user_permit";
	public static final String SENDER_NAME_READONLY = "sender_name_readonly";
	public static final String DELETE_OBJECTS = "deleteObjects";
	public static final String UPDATE_OBJECTS = "updateObjects";
	public static final String CLIENT_URL = "clientUrl";
	public static final String SAAR_URL = "saarUrl";
	public static final String SHOULD_SEND_MAIN_FORMAT = "shouldSendMainFormat";
	public static final String SHOULD_SEND_PDF_ATTACHMENT = "shouldSendPDFAttachment";
	public static final String SHOULD_SEND_PDF_LINK = "shouldSendPDFLink";
	public static final String UNDEFINED = "undefined";
	public static final String FAVORITE_TEMPLATES = "favorite_templates";
	public static final String VERSION = "version";
	public static final String GOV_BASE_RELATION = "gov_base_relation";
	public static final String RELATION_COUNT = "relation_count";
	public static final String DOCX = "msw12";
	public static final String LABEL_TEXT="label_text";
	public static final String COLUMNS_SELECTOR="columns_selector";
	public static final Object UNIT_ID = "unitId";
	
	public static final HashMap <String, String> SPECIAL_FOLDERS_IDS = new HashMap <String, String>()
	{
		private static final long serialVersionUID = 1L;
		{
			put("-10", "getUserLastObjects");
			put("-1000", "getUserFavoriteDocs");
		}
	};
	
	public static final HashMap <String, String> SENDER_NAME_VALIDATION_TYPE_EXCEPTIONS = new HashMap <String, String>()
	{
		private static final long serialVersionUID = 1L;
		{
			//"gov_discipline_folder";
			put("gov_folder", "gov_folder");
			put("gov_unit_folder", "gov_unit_folder");
			put("gov_giyur_folder", "gov_giyur_folder");
		}
	};
	
	public static final HashMap <String, String> FOLDER_TYPES = new HashMap<String, String>()
	{
		private static final long serialVersionUID = 1L;

		{
			put(NRConstants.GOV_FOLDER, NRConstants.GOV_FOLDER);
			put(NRConstants.GOV_COURT_FOLDER, NRConstants.GOV_COURT_FOLDER);
			put(NRConstants.GOV_COMMITTEE_FOLDER, NRConstants.GOV_COMMITTEE_FOLDER);
			put(NRConstants.GOV_MEETING_FOLDER, NRConstants.GOV_MEETING_FOLDER);
			put(NRConstants.GOV_REQUEST_FOLDER, NRConstants.GOV_REQUEST_FOLDER);
			put(NRConstants.GOV_DISCIPLINE_FOLDER, NRConstants.GOV_DISCIPLINE_FOLDER);
			put(NRConstants.GOV_GIYUR_FOLDER, NRConstants.GOV_GIYUR_FOLDER);
		}
	};
	//Queries
    public static final String QUERY_FORMAT_BY_MIME = "select name from dm_format where mime_type = '%1'";
    public static final String QUERY_FORMAT_BY_EXTENSION = "select name from dm_format where dos_extension = '%1'";
    public static final String QUERY_MIME_BY_FORMAT = "select mime_type from dm_format where name = '%1'";
    public static final String QUERY_MIME_EXTENSION_BY_FORMAT = "select mime_type,dos_extension from dm_format where name = '%1'";
    public static final String QUERY_FOLDERS_FROM_OBJECT = "select r_object_id,r_object_type from dm_sysobject where folder(id('%1')) and (r_object_id like '0b%' or r_object_id like '0c%') and a_is_hidden = false enable(RETURN_RANGE %2 %3 '%4')";
    public static final String QUERY_NOT_FOLDERS_FROM_OBJECT = "select r_object_id,r_object_type from dm_sysobject where folder(id('%1')) and (r_object_id not like '0b%' and r_object_id not like '0c%') enable(RETURN_RANGE %2 %3 '%4')";
    public static final String QUERY_FOLDERS_PATH = "select r_object_id, r_folder_path from dm_folder where r_object_id in (%1)";
    public static final String QUERY_USER_FAVORITES = "select o.r_object_id as \"r_object_id\",object_name,order_no,o.r_object_type from dm_relation r, dm_sysobject o where r.relation_name = 'dm_subscription' and r.child_id = '%1' and (r.parent_id like '0b%' or r.parent_id like '0c%') and r.parent_id = o.r_object_id order by r.order_no";
    public static final String QUERY_USER_FAVORITE_DOCS = "select o.r_object_id as \"r_object_id\",object_name,order_no,o.r_object_type from dm_relation r, dm_sysobject o where r.relation_name = 'dm_subscription' and r.child_id = '%1' and (r.parent_id like '09%') and r.parent_id = o.r_object_id order by r.order_no";
    public static final String QUERY_IS_FAVORITE_EXITS = "select r_object_id from dm_relation where relation_name = 'dm_subscription' and child_id = '%1' and  parent_id = '%2'";
    public static final String QUERY_MAX_FAVORITES_ORDER_NO = "select max(order_no) as order_no from dm_relation where relation_name = 'dm_subscription' and child_id = '%1'";
    public static final String QUERY_UPDATE_FAVORITES_ORDER_NO = "update dm_relation object set order_no=%1 where relation_name = 'dm_subscription' and child_id = '%2' and parent_id='%3'";
    public static final String QUERY_DELETE_FAVORITES = "delete dm_relation OBJECTS where parent_id in (%1) and child_id = '%2' and relation_name = 'dm_subscription'";
    public static final String QUERY_LAST_DOCUMENTS = "select r_object_id from gov_document where r_lock_owner = '%1' or r_modifier = '%1' and DATEDIFF(week, \"r_modify_date\" , DATE(TODAY))<=2 order by r_lock_owner desc,r_modify_date desc ENABLE (SQL_DEF_RESULT_SET 350)";
    public static final String QUERY_CHECKED_OUT_DOCUMENTS = "select r_object_id from gov_document where r_lock_owner = '%1'";
    public static final String QUERY_GET_TEMPLATES = "SELECT r_object_id, object_name FROM gov_document WHERE r_object_type = 'gov_document' and FOLDER('/Templates',DESCEND) order by object_name";    
    public static final String QUERY_FAVORITE_TEMPLATE = "SELECT d.r_object_id, d.object_name FROM gov_user u, gov_document d WHERE  d.r_object_type = '%1' AND any d.r_version_label in('CURRENT') AND any u.favorite_templates =  d.i_chronicle_id  AND u.user_name ='%2' ORDER BY u.i_position DESC ENABLE(ROW_BASED)";
    //public static final String QUERY_TEMPLATE_WITHOUT_FAVORITE = "SELECT r_object_id, object_name FROM gov_document WHERE r_object_type = 'gov_document' AND (unit_id = '%1' or unit_id = '' or unit_id is null) AND FOLDER('/Templates',DESCEND) AND i_chronicle_id not in (SELECT favorite_templates FROM gov_user WHERE user_name = '%2') ORDER BY object_name";
    public static final String QUERY_TEMPLATE_WITHOUT_FAVORITE_USER_HAS_NO_FAVORITES = "SELECT r_object_id, object_name FROM gov_document WHERE r_object_type = '%1' AND FOLDER('/Templates',DESCEND) ";
    public static final String QUERY_TEMPLATE_WITHOUT_FAVORITE_USER_HAS_FAVORITES_ADDENDUM = "AND i_chronicle_id not in (SELECT favorite_templates FROM gov_user WHERE user_name = '%2' and favorite_templates != ''  and favorite_templates != ' ' and favorite_templates is not nullstring) ";
    public static final String QUERY_TEMPLATE_WITHOUT_FAVORITE_ORDER_BY_ADDENDUM = "ORDER BY object_name ENABLE (row_based)";
    public static final String QUERY_DEFULT_LOCATION = "select r_object_id,object_name,r_object_type,a_content_type,r_lock_owner from dm_cabinet where is_private = '0' and a_is_hidden= '0' order by object_name";    
    public static final String QUERY_ADVANCED_SEARCH =  "select DISTINCT r_object_id,r_modify_date,object_name,r_modify_date,r_object_id,r_object_type,r_lock_owner,owner_name,r_link_cnt,r_is_virtual_doc,r_content_size,a_content_type,i_is_reference,r_assembled_from_id,r_has_frzn_assembly,a_compound_architecture,i_is_replica,r_policy_id,item_type,doc_type,gov_id,doc_date FROM %1 WHERE a_is_hidden=FALSE %2 order by 2 desc enable(fetch_all_results 350)";
    public static final String QUERY_HAS_ITEMS_IN_FOLDER = "select count(*) as hasItem from dm_sysobject where any i_folder_id = '%1'";
    public static final String QUERY_R_OBJECT_ID_BY_TYPE_AND_GOV_ID = "select r_object_id from %1 where gov_id = '%2'";
    public static final String QUERY_ADVANCED_SEARCH_WITH_SEARCH_TEXTUAL =  "select DISTINCT r_object_id,r_modify_date,object_name,r_modify_date,r_object_id,r_object_type,r_lock_owner,owner_name,r_link_cnt,r_is_virtual_doc,r_content_size,a_content_type,i_is_reference,r_assembled_from_id,r_has_frzn_assembly,a_compound_architecture,i_is_replica,r_policy_id,item_type,doc_type,gov_id,doc_date,sender_name,addressee_name FROM %1 SEARCH DOCUMENT CONTAINS '%2' WHERE a_is_hidden=FALSE %3 and any sender_id is not NULLSTRING order by 2 desc enable(fetch_all_results 350)";
//    public static final String QUERY_XPLORE_SEARCH = "select r_object_id,object_name,r_object_type,SCORE,SUMMARY from %1 SEARCH DOCUMENT CONTAINS '%2' ENABLE (FTDQL)";
    public static final String QUERY_XPLORE_SEARCH = "select SCORE, SUMMARY, r_object_id,object_name,r_object_type from %1 SEARCH DOCUMENT CONTAINS '%2' where acl_name not in ('gov_recyclebin_acl')";
    public static final String QUERY_NOFTDQL_SEARCH = "SELECT SCORE, SUMMARY, r_object_id, object_name, r_object_type FROM %1 WHERE ((object_name LIKE '%%2%' ESCAPE '\\')) AND (a_is_hidden = FALSE) ENABLE(NOFTDQL, SQL_DEF_RESULT_SET 350)";
    public static final String QUERY_ROLE_BY_NAME = "dm_group where group_name = '";
    public static final String QUERY_USER_BY_LOGIN_NAME = "dm_user where user_login_name = '";
    public static final String QUERY_USERNAME_BY_LOGIN_NAME = "select user_name from gov_user where user_login_name = '%1'";
    public static final String QUERY_OUTLOOK_FIELDS = "select * from gov_outlook_fields where outlook_id = '%1'";
    public static final String QUERY_DOCUMENT_VERSIONS = "select r_object_id, r_version_label from gov_document (all) where gov_id =(select gov_id from gov_document (all) where r_object_id='%1')";
    public static final String QUERY_USER_ADDRESS_BY_HEB_NAME = "select user_address from gov_user where first_name_heb = '%1' and last_name_heb = '%2'";
    public static final String QUERY_LINKS_EXIST = "select child_id, parent_id from dm_relation where parent_id in (%1) and child_id in (%1)";
    public static final String QUERY_LINKED_OBJECTS = "select child_id as r_object_id from dm_relation where parent_id = '%1' and relation_name = 'gov_base_relation' union select parent_id as r_object_id from dm_relation where child_id = '%1' and relation_name = 'gov_base_relation'";
    public static final String QUERY_VERSIONS = "select r_object_id from gov_document (all) where gov_id = '%1'";
    public static final String QUERY_LINKED_OBJECTS_PARENT_ID = "select parent_id from dm_relation where relation_name = 'gov_base_relation' and ((child_id = '%1' and parent_id = '%2') or (child_id = '%2' and parent_id = '%1'))";
    public static final String QUERY_RELATION_COUNT_BY_TYPE_AND_ID = "select relation_count from %1 where r_object_id = '%2'"; 
    public static final String QUERY_IS_CODE_TABLE_ATTRIBUTE ="select r_object_id  from gov_codetable_config where (object_type_name = 'gov_document' or object_type_name  ='%1') and attr_name ='%2'";

    //gov_event_record constants
    public static final String GOV_EVENT_RECORD = "gov_event_record";
    public static final String OBJECT_GOV_ID = "object_gov_id";
    public static final String OBJECT_TYPE_NAME = "object_type_name";
    public static final String IS_AUTO_EVENT = "is_auto_event";
    public static final String STATUS = "status";
    public static final String START_DATE = "start_date";
    public static final String WAS_DISTRIBUTED = "was_distributed";
    public static final String EVENT_TYPE = "event_type";
    
    //UserInfo Service
    public static final String DM_RELATION = "dm_relation";
    public static final String RELATION_NAME_VALUE = "dm_subscription";
    public static final String PERMANNENT_LINK = "1";
	public static final String PERMANENT_LINK = "permanent_link";
	public static final String RELATION_NAME_KEY = "relation_name";
	public static final String CHILD_ID = "child_id";
	public static final String PARENT_ID = "parent_id";
    
    //Validation error codes
    public static final String VE_MUST_HAVE_INPUT = "vemusthaveinput";
    public static final String VE_NO_FILE_SELCTED = "venofileselcted";
    public static final String VE_NOT_VALID_EMAIL = "venotvalidemail";
    public static final String VE_NOT_VALID_FOLDER_IDS = "venotvalidfolderids";
    public static final String VE_NOT_VALID_OBJECT_TYPE = "venotvalidobjecttype";
    public static final String VE_VALUE_MUST_BE_NUMERIC = "vevaluemustbenumeric";
    public static final String VE_NOT_VALID_DATE_FORMAT = "venotvaliddateformat";
    public static final String VE_NOT_VALID_OBJECT_IDS = "venotvalidobjectids";
    public static final String VE_NOT_VALID_GOV_IDS = "venotvalidgovids";
    public static final String VE_NOT_VALID_UPDATE_OBJECTS = "venotvalidupdateobjects";
    public static final String VE_NOT_VALID_SENDER_NAME = "venotvalidsendername";
    public static final String VE_NOT_VALID_ISRAELI_ID = "venotvalidisraeliid";
    public static final String VE_NOT_VALID_OBJECT_NAME_LENGTH = "venotvalidobjectnamelength";
    
    //JSON Attributes
    public static final String ATTR_OBJECT_TYPE = "object_type";
    public static final String ATTR_SEARCH_VALUE = "search_value";
    public static final String ATTR_TEMPLATE = "template_id";
    public static final String ATTR_TEMPLATE_NAME = "template_name";
    public static final String ATTR_OBJECT_NAME = "object_name";
    public static final String ATTR_SENDER_NAME = "sender_name";
    public static final String ATTR_FOLDER_PATH = "r_folder_path";
    public static final String ATTR_DOC_TYPE = "doc_type";
    public static final String ATTR_SUB_DOC_TYPE = "sub_doc_type";
    public static final String ATTR_ITEM_TYPE = "item_type";
    public static final String ATTR_SENSITIVITY = "sensitivity";
    public static final String ATTR_SOURCE = "source";
    public static final String ATTR_STATUS = "status";
    public static final String ATTR_STATUS_DATE = "status_date";
    public static final String ATTR_FROM_STATUS_DATE = "from_status_date";
    public static final String ATTR_TO_STATUS_DATE = "to_status_date";
    public static final String ATTR_FROM_DATE = "from_date";
    public static final String ATTR_TO_DATE = "to_date";
    public static final String ATTR_ADDRESSEE_ID = "addressee_id";
    public static final String ATTR_CC_ID = "cc_id";
    public static final String ATTR_KEYWORDS = "keywords";
    public static final String ATTR_OLD_REF_ID = "old_ref_id";
    public static final String ATTR_OBJECT_TYPE_VA = "objectType";
    public static final String ATTR_ATTR_NAME = "attrName";
    public static final String ATTR_VALUES = "values";
    public static final String ATTR_DEPENDENCY_NAMES = "dependencyNames";
    public static final String ATTR_DEPENDENCY_VALUES = "dependencyValues";
    public static final String ATTR_CLASSIFICATION = "classification";
    public static final String ATTR_OPEN_DATE = "open_date";
    public static final String ATTR_FIRST_NAME = "first_name";
    public static final String ATTR_LAST_NAME = "last_name";
    public static final String ATTR_DISTRICT = "district";
    public static final String ATTR_BIRTH_DATE = "birth_date";
    public static final String ATTR_STREET_ADDRESS = "street_address";  
    public static final String ATTR_PHONE = "phone";
    public static final String ATTR_COMMUNITY_DATE = "community_date";
    public static final String ATTR_REQUEST_DATE = "request_date";
    public static final String ATTR_FIRST_LABEL = "first_label";
    public static final String ATTR_SECOND_LABEL = "second_label";
    public static final String ATTR_EXTRA_LABEL = "extra_label";
    public static final String ATTR_CONTENT_TYPE = "a_content_type";
    public static final String ATTR_IS_FINAL = "is_final";
    public static final String SEARCH_TEXTUAL = "search_textual";
    public static final String USER_SUBSCRIBED = "user_subscribed";
    public static final String USER_ADDRESS = "user_address";
    public static final String SEARCH_IN_FOLDER = "search_in_folder";
    public static final String FOLDER_PATH = "folder_path";
    public static final String CURRENT_FOLDER_PATH = "currentFolderPath";
    
    //DQL parts
	public static final String OP_GREAT_EQ = " >= ";
	public static final String OP_SMALL_EQ = " <= ";
	public static final String EQUAL = " = ";
	public static final String START_DAY_TIME = " 00:00:00";
	
	//JSON filter
	public static final String VALIDATE_SERVICE = "vs/validate";
	public static final String POST_REQUEST = "POST";
	public static final String REQUEST_PARAM_OBJECT_ID = "objectId";
	public static final String REQUEST_PARAM_OBJECT_TYPE = "objectType";
	public static final String REQUEST_PARAM_PAGE = "page";
	public static final String REQUEST_PARAM_ORDER_BY = "orderBy";
	public static final String REQUEST_PARAM_UNIT_ID = "unitId";
	
	//Object prefixes
	public static final String DOCUMENT_OBJECT_PREFIX = "09";
	public static final String FOLDER_OBJECT_PREFIX = "0b";
	public static final String CABINET_OBJECT_PREFIX = "0c";
	public static final String UNTITLED = "Untitled";
	public static final String NEW_OBJECT_LABEL = "_NEW_";

	//JSON parsing parts
	public static final String OPEN_BRACKET = "[";
	public static final String CLOSE_BRACKET = "]";
	public static final int R_OBJECT_ID_LENGTH = 16; 
	public static final int MAX_FIELD_LENGTH = 32; 
	
	//Regular expressions
	public static final String REGEX_NUMERIC = "^[0-9]\\d*$";
	public static final String REGEX_LETTERS_ONLY = "[a-zA-Z_]+";
	public static final String REGEX_SENDER_NAME = "^[A-Za-z0-9\\u0590-\\u05FF\\uFB1D-\\uFB40\\s_\\'\\\"\\-,.;()@#]{1,127}$";
	public static final String REGEX_WINDOWS_FILE_NAME_PROHIBITED_CHARACTERS = "[/\\\\:*?\"<>|]";
	
	//Content types
	public static final String CONTENT_TYPE = "content-type";
	public static final String CONTENT_JSON = "application/json";
	public static final String CONTENT_FORM = "multipart/form-data";
	
	//Service
	public static final String UNIT_SERVICE_CLASS = "com.gov.base.sbo.IGovUnitService";
	public static final String SHARE_ACL_CLASS = "com.gov.base.sbo.IGovShareAclService";
	
	//Role
	public static final String USER_CAN_CHANGE_SENDER_NAME = "gov_change_sender_role";
	public static final String USER_CAN_CREATE_FOLDERS_ROLE = "gov_create_folders_role";
	public static final String USER_CAN_CREATE_LEGAL_FOLDERS_ROLE = "gov_create_legal_folders_role";
	public static final String USER_CAN_CREATE_COMMITTEES_FOLDERS_ROLE = "gov_create_committees_folders_role";
	
	public static final Object NOT_IN_CREATE_FOLDERS_ROLE = "NOT_IN_CREATE_FOLDERS_ROLE";
	
	//UnitLayerNames
	public static final String LISHKA = "lishka";
	public static final String LEGAL_APP = "legal_app";
	public static final String COMMITTEES = "committees";
	public static final String DISCIPLINE = "discipline";
	public static final String GIYUR = "giyur";
	
	public static final String SESSION_MANAGER = "sessionManager";
	public static final String RECIPIENTS = "recipients";
	public static final String SUBJECT = "subject";
	public static final String MESSAGE = "message";
	public static final String ENVIRONMENT_PROPERTIES = "environment.properties";
	public static final String FOLDER_ROLES = "folder_roles.properties";
	public static final String HEBREW_STRINGS_PROPERTIES="hebrewStrings.properties";
	
	//Email auto event constants
	public static final String EVENT_DESC = "event_desc";
	public static final String NOT_A_HEBREW_CHAR_REGEX = ".*[A-Za-z].*";
	public static Object LOCALHOST = "localhost";
}
