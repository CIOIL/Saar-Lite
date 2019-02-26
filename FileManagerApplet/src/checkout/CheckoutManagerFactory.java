package checkout;

public class CheckoutManagerFactory
{
	public static ICheckoutManager createManager(String type){
		if ("Saar".equals(type)){
			return new SaarCheckoutManager();
		} else {
			return new SaarLiteCheckoutManager();
		}
	}
}
