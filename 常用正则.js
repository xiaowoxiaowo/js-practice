// 金额千分分割
replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// 用正则表达式获取 url 中 query 参数
function getUrlQueryParams(url = location.search){
	const params = {};
	const keys = url.match(/([^?&]+)(?==)/g);
	const values = url.match(/(?<==)([^&]*)/g);
	for(const index in keys){
		params[keys[index]] =  values[index];
	}
	return params;
}